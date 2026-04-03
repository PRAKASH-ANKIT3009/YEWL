package Lec1;

import java.util.Scanner;

public class Age {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		Scanner laj = new Scanner(System.in);
		int age = laj.nextInt();
		if(age > 18) {
			System.out.println("Vote dega");
		} else {
			System.out.println("Vote nhi dega");
		}

	}

}
